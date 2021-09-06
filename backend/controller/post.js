const Post = require('../models/posts');

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator : req.userData.userId
  });
  post.save().then(result => {
    //  console.log(result._id);
    //console.log(post);
    // console.log(result._id.toString());

    res.status(201).json({
      messege: "Post added successfully ",
      post: {
        ...result,
        id: result._id
      }
    });
  }).catch(error=>{
    res.status(500).json({messege:"Creating Post Failed"});
  });
}

exports.updatePost =  (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {

    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;

  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator:req.userData.userId
  });
  // console.log(post);
  Post.updateOne({ _id: req.params.id,creator:req.userData.userId }, post).then(result => {

    if(result.matchedCount===0){
       res.status(401).json({ messege: "Update Failed" });
     }else{

       res.status(200).json({ messege: "Update succesful!!" });
     }

    // console.log(result.modifiedCount);
  }).catch(error=>{
    res.status(500).json({messege:"Updating Post Failed"});
  });
}

exports.fetchonePost =  (req, res, next) => {
  Post.findById(req.params.id).then(response => {
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ messege: "Page not found!!" });
    }
  }).catch(error=>{
    res.status(500).json({messege:"Fetching Post Failed"});
  });
}

exports.fetchPost = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const pageno = +req.query.page;
  const postQuery = Post.find();
  let fetchedPost;
  if (pageSize && pageno) {
    postQuery.skip(pageSize * (pageno - 1)).limit(pageSize)
  }
  postQuery.then(document=>{
    fetchedPost = document;
    return Post.count();
  }).then(result => {

    res.status(201).json({
      messege: "The api is fetched succesfully",
      posts: fetchedPost,
      postCount: result
    });
  }).catch(error=>{
    res.status(500).json({messege:"Fetching Post Failed"});
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id,creator:req.userData.userId }).then(result => {
     if(result.deletedCount>0){

       res.status(200).json({ messege: "Post Deleted!!" });
     }else{
      res.status(401).json({ messege: "Deletion Failed!!" });

     }
  }).catch(error=>{
    res.status(500).json({messege:"Deletion Post Failed!"});
  });
}
