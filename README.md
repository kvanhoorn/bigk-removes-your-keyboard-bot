# bigk-removes-your-keyboard-bot
Telegrambot to remove hanging inline keyboards

## developing
I use nodemon to run during development with command 
`npm devstart`
which will restart when it detects code-changes

## production
I use pm2 to run during production wiht command
`npm start`
which will restart when it detects a crash.

Status can be checked with `pm2 list` or monitored with `pm2 monit`
