import React from "react";
import PostCreate from "../posts/post_create";
import PostView from "../posts/post_view";

class Modal extends React.Component {
  render() {
    const {
      modal,
      closeModal,
      fetchPost
    } = this.props;

    if (!modal) return null;

    let component;
    switch (modal.type) {
      case "create":
        component = <PostCreate />;
        break;
      case "postView":
        component = <PostView post={modal.options} fetchPost={fetchPost} closeModal={closeModal} />;
        break;
      default:
        return null;
    }

    return (
      <div className="modal-background" onClick={closeModal}>
        <div className="modal-child" onClick={e => e.stopPropagation()}>
          {component}
        </div>
      </div>
    )
  }
}

export default Modal;