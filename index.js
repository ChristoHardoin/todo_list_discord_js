// require the discord.js module
const Discord = require('discord.js');
const env = require('./environment.json');

// Set up Global Variable
const prefix = env.prefix;
const todo_add = prefix +  env.todo_add // to do add with prefix
const todo_create = prefix +  env.todo_create // to do create with prefix
const todo_delete = prefix +  env.todo_delete // to do delete with prefix
const todo_delete_all = prefix +  env.todo_delete_all // to do delete all with prefix
const todo_select = prefix +  env.todo_select // to do select with prefix
const todo_list = prefix +  env.todo_list // to do list with prefix
const todo_help = prefix +  env.todo_help // to do help with prefix
const todo_check = prefix +  env.todo_check // to do check with prefix

// create a new Discord client
const client = new Discord.Client();



// Array of list
var list_array = []

// Selected list
var selected_list = 0;




// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity("&todohelp"); 
});


// List All List
list_of_list = function(title, user) {

    var list_of_list_array = [];

    for(let i = 0; i < list_array.length; i++) {
        list_of_list_array.push(list_array[i].list);
    }

    return list_of_list_array
}



// Set up List template
create_list = function(title, user) {

    // Create the message list template
    var new_list = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`List #${list_array.length + 1}: ${title}`)
    .setDescription('Type &todoselect {list id}. \n Type &todoadd {message}. \n')
    .setTimestamp()
    .setFooter('Created By ' + user);

    return new_list
}

check_list = function(index) {
    for(let i = 0 ; i < selected_list.input_list.length; i++) {
        if((index - 1) == i) {
            selected_list.input_list[i] = selected_list.input_list[i].trim().replace(/-/g, '✓');
            console.log(selected_list)
            return;
        }

    }

}


// Add to do to a list selected
add_todo = function(input, is_o) {

    var list = selected_list.list;
    var input_list = selected_list.input_list;

    if(is_o == true) {
        list.setDescription(input_list.join(' \n'));
    }

    else if(input_list.length == 0) {
        input_list.push(`- ${input} `);
        list.setDescription(`- ${input} \n`);
    } else {
        input_list.push(`- ${input} `);
        list.setDescription(input_list.join(' \n'))
    }
    

}


// Delete list func
delete_list = function(list) {
    //find the proper list and delete it
    for(let i = 0; i < list_array.length; i++) {

        if(list == list_array[i].id) {
            list_array.splice(i, 1);
            return;
        }

    }

}

// Delete all list func
delete_all_list = function() {
    list_array = [];
}


// handle received messages
client.on('message', message => {


    // Get message user
    user = message.member;
    user = user.toString();
    if (user.includes("!")) {
        user = user.split("!")[1].split(">")[0];
    } else {
        user = user.split("@")[1].split(">")[0];
    }
    var user = client.users.resolve(user).tag


    // select the list of the array
    if (message.content.startsWith(todo_select)) {
        try{
            var res = message.content.substr(todo_select.length).trim();

            var sel;

            for(let i = 0; i < list_array.length; i++) {

                if(res == list_array[i].id) {
                    sel = list_array[i];

                } 

            }

            if(sel.length == 0) {
                message.channel.send("This list does not exist");
            } else {
                selected_list = sel;
                message.channel.send(sel.list);
            }
        }
        catch {
            message.channel.send("This list does not exist");
        }
    }


    // list all the list of the array
    if (message.content.startsWith(todo_list)) {
        try{
            var list = list_of_list();

            if(list.length == 0) {
                message.channel.send("No list available");
            }

            for(let i = 0; i < list.length; i++) {
                message.channel.send(list[i]);
            }
        }
        catch {
            message.channel.send("Something Went Wrong. Contact the Poney Master!");
        }
    }

    // list help for all command
    if (message.content.startsWith(todo_help)) {

        message.channel.send("\t- &todohelp => all command \n - &todocreate {name of list} \n - &todoselect {list id} \n - &todoadd {message} \n - &tododelete {list id} \n - &tododeleteall => delete all list \n - &todolist => list all of the list active ");

    }

     // add to do to selected list
     if (message.content.startsWith(todo_add)) {
        try{
            var res = message.content.substr(todo_add.length).trim();
            add_todo(res, false);
            message.channel.send(selected_list.list);
        }
        catch {
            message.channel.send("No list selected.");
        }
    }

     // add to do x to check
     if (message.content.startsWith(todo_check)) {
        try{
            var res = message.content.substr(todo_check.length).trim();
            check_list(res);
            add_todo(res, true);

            message.channel.send(selected_list.list);
        }
        catch {
            message.channel.send("No list selected or does not exist");
        }
    }



    // Delete list by the id
    if (message.content.startsWith(todo_delete)) {
        try{
            var res = message.content.substr(todo_delete.length).trim();
            
            delete_list(res.trim())

            message.channel.send("hey");
        }
        catch {
            message.channel.send("This List does not exist");
        }
    
    }

    // Delete all list 
    if (message.content.startsWith(todo_delete_all)) {
        try{
            
            delete_all_list();
            message.channel.send("All List have been cleared");
        }
        catch {
            message.channel.send("Something Went Wrong. Contact the Poney Master!");
        }
    
    }



    // Create new empty list
	if (message.content.startsWith(todo_create)) {
        var res = message.content.substr(todo_create.length).trim();
        
        var new_list = create_list(res, user)
        list_array.push({ id: list_array.length + 1,list: new_list, input_list: [] });
        message.channel.send(new_list);
    
    
    }
});












// login to Discord with your app's token
client.login(env.bot_token);