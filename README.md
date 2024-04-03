# NFT Validation TG Bot

The NFT Validation TG Bot is a project that aims to provide a Telegram bot for validating NFTs by collection in a Telegram group chat.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

Copy `.env.local` and rename as `.env` then fill up the value.

```bash
# tg-bot
BOT_TOKEN=<YOUR BOT TOKEN, E.G 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
TELEGRAM_BOT_LINK=<YOUR TG BOT LINK HERE, E.G. https://t.me/ton_connect_example_bot>
WALLETS_LIST_CAHCE_TTL_MS=86400000 # 24HR
MANIFEST_URL=https://raw.githubusercontent.com/ton-connect/demo-telegram-bot/master/tonconnect-manifest.json


# ton
TON_API_HOST=<TON API HOST, E.G. https://tonapi.io/v2>
CONNECTOR_TTL_MS=60000
NFT_COLLECTION=<YOUR NFT COLLECTION, E.G. EQCV8xVdWOV23xqOyC1wAv-D_H02f7gAjPzOlNN6Nv1ksVdL>

# kv
KV_REST_API_READ_ONLY_TOKEN=
KV_REST_API_TOKEN=
KV_REST_API_URL=
KV_URL=
```

**TON_API_HOST**
[See more about ton api]('https://tonapi.io/api-v2')

**MANIFEST_URL**
[See more about manifest url]('https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest')

## Usage

Invite the bot into your group and assign it as admin role. When members trigger the `/verify` command, bot will ask them to connect the wallet and verify permission with NFT collections.

If members have certain NFT collections in their wallet, they will receive welcome message. Otherwise, they will be removed from the group chat by the bot automatically.

## Roadmap

- [ ] Verify members immediately when they enter the group.
- [ ] Handle the exception cases.
- [ ] Make members return to the group chat after they connect the wallet.

## License

Information about the project's license. Specify the license type and provide a link to the license file if applicable.
