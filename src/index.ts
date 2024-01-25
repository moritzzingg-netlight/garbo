import express from 'express'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'
import Discord, { Client, GatewayIntentBits } from 'discord.js'
import discord from './config/discord'

import dotenv from 'dotenv'
dotenv.config()

// keep this line, otherwise the workers won't be started
import * as workers from './workers'
import {
  discordReview,
  downloadPDF,
  indexParagraphs,
  parseText,
  reflectOnAnswer,
  searchVectors,
  splitText,
} from './queues'

// add dummy job
// downloadPDF.add('dummy', {
//   url: 'https://mb.cision.com/Main/17348/3740648/1941181.pdf',
// })
/*
downloadPDF.add('volvo', {
  url: 'https://www.volvogroup.com/content/dam/volvo-group/markets/master/investors/reports-and-presentations/annual-reports/AB-Volvo-Annual-Report-2022.pdf',
})*/

// start workers
Object.values(workers).forEach((worker) => worker.run())

// start ui
const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
  queues: [
    new BullMQAdapter(downloadPDF),
    new BullMQAdapter(splitText),
    new BullMQAdapter(indexParagraphs),
    new BullMQAdapter(searchVectors),
    new BullMQAdapter(parseText),
    new BullMQAdapter(reflectOnAnswer),
    new BullMQAdapter(discordReview),
  ],
  serverAdapter: serverAdapter,
  options: {
    uiConfig: {
      boardTitle: 'Klimatkollen',
    },
  },
})

// register bot commands

const commands = [
  {
    name: 'co2',
    description: 'Läs denna PDF och ge mig en sammanfattning av utsläppen',
  },
]

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on('message', (msg) => {
  if (msg.content === 'co2') {
    msg.reply('Det kan jag gärna göra sen')
  }
  console.log('message recieved', JSON.stringify(msg, null, 2))
})

client.login(discord.APPLICATION_ID)

const app = express()

app.use('/admin/queues', serverAdapter.getRouter())
app.listen(3000, () => {
  console.log('Running on 3000...')
  console.log('For the UI, open http://localhost:3000/admin/queues')
})
