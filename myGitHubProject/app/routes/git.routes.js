module.exports = (app) => {
    const git = require('../controllers/git.controller.js');

    // get github profile
    app.get('/gitsearch', git.saveSearch);

    // Retrieve all Notes
    //app.get('/getsearchedProfle', git.getsearchedProfle);
    app.get('/user', git.user);
    
    // Delete a Note with noteId
    //app.get('/deleteSelecteduserprofile', git.deleteSelecteduserprofile);

    // // Retrieve a single Note with noteId
    // app.get('/notes/:noteId', notes.findOne);

    // // Update a Note with noteId
    // app.put('/notes/:noteId', notes.update);

}