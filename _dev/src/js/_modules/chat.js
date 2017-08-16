var messages = [];
messages.push({name: 1, text:"yo", id:Date.now()});
messages.push({name: 1, text:"Did you see his latest tweet?", id:Date.now()});
messages.push({name:'2', text:"hah no, what did he say now?", id:Date.now()});

var authors = {1: 'Author 1', 2: 'Author 2'};

class ChatApp extends React.Component {


  constructor(props) {
    super(props);

    this.state = { items: this.props.messages, text: '', name: '1', authors: this.props.authors};
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.updateAuthors = this.updateAuthors.bind(this);
  }


  // add a new item
  addItem(newItem) {

    newItem.name = newItem.name ? newItem.name : '1';

    if(newItem.insertItem) {
      var items = window.items = this.state.items;
      var index = parseInt(newItem.index);

      items.splice(index+1, 0, newItem);

      this.setState({
        items: items
      });

    }else {
      this.setState(prevState => ({
          items: prevState.items.concat(newItem),
          text: '',
          name: ''
        })
      );
    }

  }

  // update the author names when the author fields change
  updateAuthors(e) {
    e.preventDefault();
    const name = e.target.value;
    const num = parseInt(e.target.dataset.authorNum);
    var authors = this.state.authors;
    authors[num] = name;
    this.setState({
      authors: authors
    });

  }
 // remove an item from the log
  removeItem (index) {

    var items = this.state.items;
    items.splice(index, 1)
    this.setState({items: items});
  }


  // render the form
  render() {

    return React.createElement(
      'div', null,
      React.createElement(AuthorNames, {updateAuthors:this.updateAuthors, authors:this.state.authors}),
      React.createElement(ChatHeader, {title:'send new message:'}),
      React.createElement(ChatForm, { addItem:this.addItem, authors:this.state.authors, insertItem:false }),
      React.createElement(ChatHeader, {title:'Chat Log:'}),
      React.createElement(ChatList, { items: this.state.items, removeItem:this.removeItem, authors:this.state.authors, addItem:this.addItem }),
    );
  }

}

/**
* Set the author
*/
class AuthorNames extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var html = '';

    return React.createElement('div', {className:'authors-form cf'},
      React.createElement('div', null,
        React.createElement('label', null, 'Author 1'),
        React.createElement('input', {onChange: this.props.updateAuthors, 'data-author-num': 1, value: this.props.authors[1]}) ),
      React.createElement('div', null,
        React.createElement('label', null, 'Author 2'),
        React.createElement('input', {onChange: this.props.updateAuthors, 'data-author-num': 2, value: this.props.authors[2]})
      )
    );
  }
}
/**
*  Display a header element with specified content
*/
class ChatHeader extends React.Component {
  constructor(props){
    super(props);
  }
  render () {
    return React.createElement('h1', null, this.props.title)
  }
}

/**
* The Chat form
*/
class ChatForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { name: '', text: ''};
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // when the form is submitted
  onSubmit(e) {
    e.preventDefault();
    var newMsg = {
      name: this.state.name,
      text: this.state.text,
      id: Date.now(),
      insertItem: this.props.insertItem
    };

    if(this.props.insertItem && this.props.index){
      newMsg.index = this.props.index
    }
    this.props.addItem(newMsg);

  }

  // when the field changes, update the appropriate state prop
  handleChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

  }

  render() {

    //the form is a select for the author, the text field for the message, and the submit button
    return React.createElement(
        'form',
        { onSubmit: this.onSubmit, className:'new-message-form cf' },
        React.createElement(
          'div', null,
          React.createElement('label', null, 'Name'),
          React.createElement('select', { name:'name', onChange: this.handleChange, value: this.state.name },
            React.createElement('option', { value: 1 }, this.props.authors[1]),
            React.createElement('option', { value: 2 }, this.props.authors[2])

          )
        ),
        React.createElement(
          'div', null,
          React.createElement('label', null, 'Text'),
          React.createElement('input', { name:'text', onChange: this.handleChange, value: this.state.text})
        ),
        React.createElement('button', null, 'Add message')
    );
  }

}

/**
*  Render the submitted items
*/
class ChatList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var items = this.props.items.map( (item, index) => React.createElement(
      ChatItem, {item: item, index:index, key:index, removeItem:this.props.removeItem, authors:this.props.authors, addItem:this.props.addItem}
    ) );
    return React.createElement('ul', {className: 'chat-log'}, items);
  }


}

/**
* The individual item
*/
class ChatItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showField: false };
    this.removeThis = this.removeThis.bind(this);
    this.addMsg = this.addMsg.bind(this);
    this.hideInsertMsg = this.hideInsertMsg.bind(this);
    this.insertItem = this.insertItem.bind(this);
  }

  //intercept the newly add item to hide the field before passing it up the chain
  insertItem(newItem) {
    this.state.showField = false;
    this.props.addItem(newItem);
  }

  // show the insert message field
  addMsg(e) {
    e.preventDefault();
    this.setState({ showField: true });
  }

  // remove the message field (hide it)
  hideInsertMsg(e){
    e.preventDefault();
    this.setState({showField: false});
  }

  // remove the message from the log
  removeThis() {
    this.props.removeItem( parseInt(this.props.index));
  }

  render() {
    var name = this.props.authors[parseInt(this.props.item.name)];
    var className = 'message message--author-'+this.props.item.name;
    return React.createElement(
      'li',
      {className: className, key: this.props.index, id:this.props.index},
      React.createElement('h5', {className: 'message__author'}, name ),
      React.createElement('div', {className: 'message__text'},
        React.createElement('p', null, this.props.item.text),
        React.createElement('div', {className:'message__actions'},
            React.createElement('a', {className:'dashicons dashicons-plus-alt', href:'#', onClick:this.addMsg}),
            React.createElement('a', {className:'dashicons dashicons-dismiss',href:'#', onClick:this.removeThis})
        ),
      ),
      (this.state.showField && React.createElement(ChatForm, { addItem:this.insertItem, authors:this.props.authors, insertItem:true, index:this.props.index+'' }) ),
      (this.state.showField && React.createElement('a',{className:'dashicons dashicons-no', href:'#', onClick:this.hideInsertMsg})),
    );
  }

}


ReactDOM.render(
  React.createElement(ChatApp, {messages: messages, authors:authors}),
  document.querySelector('#post_format_chat_log')
);
