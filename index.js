const { Telegraf } = require('telegraf')
const fs = require('fs')

// read from file called 'telegram-token'
const token = fs.readFileSync('telegram-token', 'utf8').trim();
const bot = new Telegraf(token)

bot.start((ctx) => ctx.reply('Add me to a group to remove inline keyboards, I will leave after that'))
bot.help((ctx) => ctx.reply('Add me to a group to remove inline keyboards, I will leave after that'))

// when new chat members are added (including myself)
bot.on("new_chat_members", (ctx) => {

	const newMembers = ctx.update.message.new_chat_members;

	// see if it's me or quit
	if (newMembers.find((e) => e.id === ctx.botInfo.id) === undefined) {
		console.warn(
			"Received new_chat_members update, but did not find this bot in the list of added members."
		);
		return;
	}

	// logging chat id
	console.log(
		`Was added to group#${ctx.chat.id}. Attempting to delete stuck inline buttons`
	);

	// execute keyboard deletion
	deleteInlineButtons(ctx);

});

async function deleteInlineButtons(ctx, leaveAfterDeleting = true) {
	try {
		// Send a new message with an inline keyboard to overwrite any current keyboards
		const mockKeyboardMsg = await ctx.reply(
			"start_removing_keyboard",
			{
				reply_markup: {
					resize_keyboard: true,
					keyboard: [
						[
							{
								text: "removing_keyboard_btn_placeholder",
							},
						],
					],
				},
			}
		);

		// Delete previous message
		await ctx.deleteMessage(mockKeyboardMsg.message_id);

		// Reset keyboard
		await ctx.reply("Removed the keyboard for ya!", {
			reply_markup: {
				remove_keyboard: true,
			},
		});

	} catch (error) {
		// Log error
		console.error(
			Date.now(),
			" Failed to remove a keyboard in a chat ",
			ctx.update.message.chat.id,
			". Error:\n",
			error
		);
	}

	try {
		if (leaveAfterDeleting) await ctx.leaveChat();
	} catch (error) {
		// Whatever
	}
}

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
