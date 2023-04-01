const { User, validate } = require('../models/user');
const { Project } = require('../models/project');
const bcrypt = require('bcrypt');


//Gets all users and sorts by name
const getAllUsers = async (req, res) => {
  //Added populate method to dynamically fetch information of project document!
  const users = await User.find().populate('project', '_id, name').sort('name');
  res.send(users);
}

//Get user by username
const getUserByName = async (req, res) => {
  const { user } = req.params

  const username = await User.findOne({ username: user }).populate('project', '_id, name');
  if (!username) {
    return res.status(404).json({ fail: `no user with ${user} found` })
  }

  res.send(username);
}

//Get user by Id
const getUserById = async (req, res) => {
  const { id } = req.params

  const username = await User.findOne({ _id: id }).populate('project', '_id, name');
  if (!username) {
    return res.status(404).json({ fail: `no user with ${id} found` })
  }

  res.send(username);
}


//Adds new user
const postUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = "";
  let password = await bcrypt.hash(req.body.password, 10);

  if (req.body.projectId) {
    const project = await Project.findById(req.body.projectId);
    if (!project) return res.status(400).send('Invalid project.');

    user = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: password,
      github: req.body.github,
      linkedin: req.body.linkedin,
      project: {
        _id: project._id
      },
      bio: req.body.bio,
      likedProjects: [],
      myComments: [],
      userType: req.body.userType
    });

    //Append user to project's members 
    const appendToProject = await Project.findByIdAndUpdate(project._id,
      {
        $push: { members: user }
      }, { new: true });

  } else {
    user = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: password,
      github: req.body.github,
      linkedin: req.body.linkedin,
      bio: req.body.bio,
      likedProjects: [],
      myComments: [],
      userType: req.body.userType
    });

  }

  user = await user.save();

  res.send(user);
}

//updates the user details besides the user type
const updateUserDetails = async (req, res) => {
  const { username } = req.params;
}

//Check if the user input matches the hash. Is it safe to send this as a GET request? I'm not sure...
const comparePassWithHash = async (req, res) => {
  //Grab user from username
  const { user } = req.params

  const username = await User.findOne({ username: req.params.username });
  if (!username) {
    return res.status(404).json({ fail: `no user with ${user} found` })
  }

  //
  bcrypt.compare(req.params.plaintextpass, username.password, function(err, result) {
    res.send(result);
});
}

module.exports = {
  getAllUsers,
  getUserByName,
  getUserById,
  postUser,
  updateUserDetails,
  comparePassWithHash,
}