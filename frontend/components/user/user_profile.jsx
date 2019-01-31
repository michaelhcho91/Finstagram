import React from "react";
import NavbarContainer from "../navbar/navbar_container";
import NavbarShort from "../navbar/navbar_short";
import UserProfileItem from "./user_profile_item";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentScrollHeight: null,
      id: this.props.currentUser.id,
      photoFile: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFile = this.handleFile.bind(this);
  }
  
  componentDidMount() {
    window.scrollTo(0, 0);

    const {
      fetchPosts,
      fetchLikes,
      fetchComments
    } = this.props;
    
    const {
      currentScrollHeight
    } = this.state;
    
    fetchPosts();
    fetchLikes();
    fetchComments();
    this.setState({
      currentScrollHeight: window.scrollY
    });

    window.onscroll = () => {
      const newScrollHeight = Math.ceil(window.scrollY / 50) * 50;
      if (currentScrollHeight !== newScrollHeight) {
        this.setState({
          currentScrollHeight: newScrollHeight
        });
      }
    };
  }
  
  handleSubmit(e) {
    e.preventDefault();

    const {
      photoFile
    } = this.state;

    const {
      updateUser
    } = this.props;

    const formData = new FormData();
    if (photoFile) {
      formData.append(
        "user[photo]",
        photoFile
      );
    }

    updateUser(formData);
  }
  
  handleFile(e) {
    const file = e.currentTarget.files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      this.setState({
        photoFile: file,
      });
    };

    if (file) fileReader.readAsDataURL(file);

    const form = document.getElementById("profile-form");
  }
  
  render() {
    const {
      posts,
      currentUser,
      openModal,
      logout
    } = this.props;

    const {
      currentScrollHeight
    } = this.state;
    
    let postsList;
    let myPosts;
    if (posts) {
      myPosts = posts.filter(post => post.posterId === currentUser.id);
      postsList = myPosts.map( (post, idx) => {
        return <UserProfileItem post={post} 
                                key={idx}
                                openModal={openModal} />
      });
    } else postsList = null;

    const postCount = myPosts.length;
    let postOrPosts = "posts";
    if (postCount === 1) postOrPosts = "post";
    
    let navbar;
    if (currentScrollHeight <= 90) {
      navbar = <NavbarContainer />
    } else {
      navbar = <NavbarShort />
    }
    
    return (
      <>
        {navbar}
      
        <main className="user-profile-container">
          <div className="user-profile">
            <header className="user-profile-info">
              <div className="profile-pic">
                <form id="profile-form" onSubmit={this.handleSubmit}>
                  <input className="profile-file-input" id="profile-file-input" type="file" onChange={this.handleFile}/>
                  <label htmlFor="profile-file-input">
                    <img src={currentUser.photoUrl}/>
                  </label>
                </form>
              </div>

              <section className="profile-info">
                <div className="username-cog">
                  <h1>{currentUser.username}</h1>

                  <div>
                    <button className="logout-button" onClick={logout}>Logout</button>
                  </div>
                </div>

                <div>
                  <ul className="user-post-follow-list">
                    <li>{postCount} {postOrPosts}</li>
                    <li>0 followers</li>
                    <li>0 following</li>
                  </ul>
                  <div>
                    <h1 className="profile-name">{currentUser.name}</h1>
                    <span>{currentUser.bio}</span>
                  </div>
                </div>
              </section>
            </header>

            <ul className="user-posts">
              {postsList}
            </ul>
          </div>
        </main>
      </>
    )
  }
}

export default UserProfile;