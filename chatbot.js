let teeworlds = require('teeworlds');
let readline = require('readline');

// Create interface for input and output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let ans = "";
rl.question('address: ', (answer) => {
    ans = answer;

    const [ip, port] = ans.split(':');
    let client = new teeworlds.Client(ip, Number.parseInt(port), "haxxer_bot", {
        identity: {
            name: 'haxxer_bot',
            clan: 'haxxer_team',
            color_body: '',
            color_feet: '',
            id: 0,
            country: 'BRA',
            skin: 'itsabot',
            use_custom_color: false,
        },
    });

    client.on("connected", () => {
        client.game.Say("Hello, there!, I'm haxxer_bot! If you need help just type '.help'!");
    });

    client.on("message", (msg) => {
        const authorName = msg.author?.ClientInfo?.name || "server"; // Use "server" if name is undefined
        const messageContent = msg.message;
        
        console.log(authorName, messageContent);

        const command_message = messageContent.toLowerCase();

        if (command_message === ".help") {
            client.game.Say(`${authorName}: Commands: .help, .myskin, .say, .leave, .users, .ping, .team, .kill, .invite`);
        } else if (command_message === ".myskin") {
            client.game.Say(`${authorName}: Your skin: ${msg.author?.ClientInfo?.skin}`);
        } else if (command_message.startsWith(".say ")) {
            client.game.Say(messageContent.slice(".say ".length));
        } else if (command_message === ".leave") {
            client.Disconnect();
        } else if (command_message === ".users") {
            let list = client.SnapshotUnpacker.AllObjClientInfo.map(a => a.name);
            client.game.Say("Users: " + list.join(", "));
        } else if (command_message === ".ping") {
            client.game.Ping().then((ping) => client.game.Say("Ping: " + ping));
        } else if (command_message.startsWith(".team")) {
            const team = command_message.split(" ")[1];
            if (!team) {
                client.game.Say("Please provide a team number. Usage: .team [team_number]");
            } else {
                client.game.Say(`/team ${team}`);
            }
        } else if (command_message.startsWith(".invite")) {
            const user = messageContent.split(" ")[1]; // Get the user from the command
            if (!user) {
                client.game.Say("Please provide a user name or user ID. Usage: .teaminvite [username or user ID]");
                return;
            }
        
            // Check if the user exists in the client info (assuming you're using a similar structure)
            const targetUser = client.SnapshotUnpacker.AllObjClientInfo.find(u => u.name === user || u.id === parseInt(user));
        
            if (!targetUser) {
                client.game.Say(`User ${user} not found.`);
                return;
            }
        
            // Invite the user to a team (assuming there is a command for this)
            client.game.Say(`/W ${authorName} Inviting ${targetUser.name} (ID: ${targetUser.id}) to the bot's team!`);
        
            // Assuming there's an actual invite process in Teeworlds:
            client.game.Say(`/invite ${targetUser.name}`);
        } else if (command_message === ".kill") {
            client.game.Kill()
        }
    });

    client.on("error", (err) => {
        console.error("Connection error:", err);
        process.exit(1); // Exit on connection failure
    });

    client.connect();

    process.on("SIGINT", () => {
        client.Disconnect().then(() => process.exit(0)); // Disconnect on Ctrl+C
    });

    process.on("SIGTERM", () => {
        client.Disconnect().then(() => process.exit(0)); // Disconnect on termination
    });
});