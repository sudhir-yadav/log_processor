const watch   = require('node-watch');                      // Library to watch file changes.
const fs      = require('fs');                              // Library to read file data.
const argv    = require('minimist')(process.argv.slice(2)); // Getting file arguments.
const express = require('express');                         // Hosting a page.
const app     = express();                                  // Hosting a page.
const http    = require('http').Server(app);                // Http server. 
const io      = require('socket.io')(http);                 // Serving live data.

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
   console.log('listening on *:3000');
});

if( typeof argv[ 'file' ] !== 'string' ) {
   console.error( "Invalid file parameter " );
   return;
}

if( argv[ 'file' ] === '' ) {
   console.error( "Please provide file name" );
   return;
}

fs.access(argv[ 'file' ], fs.F_OK, (err) => {
   if (err) {
     console.error(err);
     return;
   }
});

$filepath = argv[ 'file' ];

let init_file_con = fs.readFileSync( $filepath, 'utf8' );

watch( $filepath, (event, filename) => {
   
   file_new_content   = fs.readFileSync( $filepath, 'utf8');        // Get new content of the file.
   let latest_content = getDiff(file_new_content,init_file_con);    // Get differece between old and new file.
   init_file_con      = file_new_content;                           // Make new content old.
   console.log(JSON.parse(latest_content));

   io.emit('file-change', JSON.parse(latest_content));

});

const getDiff = (string, diffBy) => string.replace(diffBy, "").replace(/\n/g, " ").trim();   // Output string difference.

