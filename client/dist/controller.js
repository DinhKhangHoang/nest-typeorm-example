class User {
  constructor(data) {
    this.user_id = data.user_id;
    this.avatar = data.avatar;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
  }
  getInfo() {
    return {
      user_id: this.user_id,
      avatar: this.avatar,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
    };
  }
  createCardUser() {
    return `
        <div id = ${this.user_id} class="item col-xs-4 col-lg-4">
          <div class="thumbnail card">
            <div class="img-event">
              <img
                class="group list-group-image img-fluid"
                src="${this.avatar}"
                alt=""
              />
            </div>
            <div class="caption card-body">
              <h4 class="group card-title inner list-group-item-heading">
                ${this.first_name + ' ' + this.last_name}
              </h4>
              <p class="group inner list-group-item-text">
                Description
              </p>
              <div class="row">
                <div class="col-xs-12 col-md-12">
                  <p class="lead">
                    ${this.email}
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12 col-md-3">
                  <button class="btn btn-success" 
                    data-toggle="modal"
                    data-target="#squarespaceModal"
                    onclick="setDefaultInfoForUpdateUser(${this.user_id})"
                  >Edit</button>
                </div>
                <div class="col-xs-12 col-md-3">
                  <button class="btn btn-danger" 
                    onclick="deleteUserHandler(${this.user_id})"
                  >Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
  }
}

var DictionaryUsers = {};

$(document).ready(function() {
  getData();
  $('#list').click(function(event) {
    event.preventDefault();
    $('#products .item').addClass('list-group-item');
  });
  $('#grid').click(function(event) {
    event.preventDefault();
    $('#products .item').removeClass('list-group-item');
    $('#products .item').addClass('grid-group-item');
  });
});

async function getData() {
  $.get('/api/users', function(data, status) {
    if (data !== null) {
      let listUsers = data;
      console.log(listUsers);
      for (let index in listUsers) {
        user = new User({ ...listUsers[index] });
        DictionaryUsers[user.user_id] = user;
        $('#products').append(user.createCardUser());
      }
    }
  });
}

function postUserHandler(event) {
  event.preventDefault();
  const user = {
    avatar: $('#avatar').val(),
    first_name: $('#firstname').val(),
    last_name: $('#lastname').val(),
    email: $('#email').val(),
  };
  $.post('/api/users', user, function(data, status) {
    if (data !== null) {
      addedUser = new User({ ...data });
      DictionaryUsers[addedUser.user_id] = addedUser;
      $('#products').append(addedUser.createCardUser());
      resetForm();
    }
  });
}

function updateUserHandler(event) {
  event.preventDefault();
  const user = {
    user_id: $('#inputId').val(),
    avatar: $('#inputAvatarLink').val(),
    first_name: $('#inputFirstName').val(),
    last_name: $('#inputLastName').val(),
    email: $('#inputEmail').val(),
  };
  $.ajax({
    url: `/api/users/${user.user_id}`,
    type: 'PUT',
    data: user,
    success: function(data, status) {
      if (data !== null) {
        updatedUser = new User({ ...data });
        DictionaryUsers[updatedUser.user_id] = updatedUser;
        $(`#${updatedUser.user_id}`).replaceWith(updatedUser.createCardUser());
        $('#squarespaceModal').trigger('click');
        alert('Update successfully!');
      }
    },
  });
}

function deleteUserHandler(userId) {
  const user = DictionaryUsers[userId];
  if (user !== null) {
    $.ajax({
      url: `/api/users/${user.user_id}`,
      type: 'DELETE',
      data: user.getInfo(),
      success: function(data, status) {
        if (data !== null) {
          $(`#${userId}`).remove();
          delete DictionaryUsers[userId];
        }
      },
    });
  }
}

function setDefaultInfoForUpdateUser(userId) {
  let user = DictionaryUsers[userId].getInfo();
  if (user !== null) {
    $('#inputId').val(user.user_id.toString());
    $('#inputAvatarLink').val(user.avatar);
    $('#inputFirstName').val(user.first_name);
    $('#inputLastName').val(user.last_name);
    $('#inputEmail').val(user.email);
  }
}

function resetForm() {
  $('#inputAvatarLink').val('');
  $('#inputFirstName').val('');
  $('#inputLastName').val('');
  $('#inputEmail').val('');
}
