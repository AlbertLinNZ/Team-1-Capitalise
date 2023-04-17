const express = require('express');
const router = express.Router();

//Grabs auth and admin functions from the middleware (for Authorization)
const {auth} = require('../middleware/auth');
const admin = require('../middleware/admin');
const graduate = require('../middleware/graduate');

const {
  getAllProjects,
  getProjectsByLikes,
  getProjectByBadge,
  getProject,
  updateProjectById,
  addNewProject,
  addUserToProject,
  deleteProject,
  searchProjects,
  writeComment,
  likeComment,
  deleteComment,
  incrementViews,

} = require('../controllers/projectController')

//Get all projects
router.get('/', getAllProjects);

//Add new project. Requires authorization. 
router.post('/', [auth, graduate], addNewProject);

//Need to add more projects to properly test this
router.get('/likes', getProjectsByLikes)

//Need to add more projects to properly test this
router.get('/search', searchProjects)

//Find a project by id
router.get('/:projectId', getProject);

//Update a project
router.patch('/:projectId', [auth, graduate], updateProjectById)

//Delete the project. Will carry out general authorization first, before admin authorization. 
router.delete('/:projectId', [auth, admin], deleteProject)

//Get projects with :badge whatever
router.get('/badges/:badge', getProjectByBadge);

//This put call appends a user to a project. It is not great.
router.put('/:id/:userid', [auth, graduate], addUserToProject);

//Writes a comment. Appends it to the relevant user and project. 
router.post('/comment', auth, writeComment);

//Create a route that likes or unlikes a project
router.patch('/:projectId/like', auth, likeComment)

//Delete a comment. Removes comment from relevant user and project. 
router.delete('/comment/:commentId', auth, deleteComment);

//Increments the view counter of a page
router.patch('/:projectId/incrementViews', incrementViews);



module.exports = router;