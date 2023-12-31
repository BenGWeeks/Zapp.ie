# ZapVibes

ZapVibes is a React web application that allows employees to reward each other with Zaps (Bitcoin Sats) for help etc. It is similar to Karma Bot except that rather than using Karma tokens, we are using real Bitcoin.

The designs are here: [Figma Designs](https://www.figma.com/file/i0GdiVa7Dgu1FVSNwhBpjZ/ZapVibes?type=design&node-id=0%3A1&mode=design&t=iHYpSelfP4mOKpqK-1)

When zapping someone, a pop-up with request who they are zapping, the amount (custom, or default amounts of 5000, 10000 or 25000) what "Principle" it relates to (in settings, they should be able to define their Principles (such as "We are transparent", "We are knowledgeable", etc.) and a description.

Each user will be allowed a specified budget to be able to zap other users. Zaps will go to users actual Lightning Wallets.

There will be pages to see a log of Zaps sent, a Leader board of zaps for the last week, a feed of zaps for the last week, and a rewards page where they can see a list of rewards that they can redeem their Zaps for (by sending their Lightning Sats back to). These will have things such as "Secretlabs Magnus Pro Desk", "Samsunf Odyssey G5 Screen", or a "Corsair ST50 Stand". The Redeem page should also show a feed of what people have redeemed. There should be a bounties page where bounties can be published by management that can be redeemed if completed (paid as Sats).

This will be a web application built using the React framework (and @fluentui/react-components).

This will be initially be embedded into Microsoft Teams to allow users to "Zap" each other. We therefore need to be able to deploy this solution to Microsoft Teams as a Teams app. This should add a new zap button to the Teams input (where you can attach files, add emoji's, add gifs etc.)

In the future, we will develop the ability to embed this into Slack.

Each user should have an associated nPub (a Nostr ID) that can be "zapped".
