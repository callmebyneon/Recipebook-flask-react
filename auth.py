from flask import request, jsonify, make_response
from flask_restx import Resource, Namespace, fields
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import User

auth_ns = Namespace('auth', description="A namespace for our Authentication")


#model (serializer)
signup_model = auth_ns.model(
  "SignUp",
  {
    "username": fields.String(),
    "email": fields.String(),
    "password": fields.String(),
  }
)

login_model = auth_ns.model(
  "Login",
  {
    "username": fields.String(),
    "password": fields.String(),
  }
)

# drop_model = auth_ns.model(
#   "Drop",
#   {
#     "id": fields.Integer(),
#     "username": fields.String(),
#     "email": fields.String(),
#     "password": fields.String(),
#   }
# )


@auth_ns.route('/signup')
class SignUp(Resource):
  @auth_ns.expect(signup_model)
  def post(self):
    """Create a new user"""
    data = request.get_json()
    username = data.get('username')

    db_user = User.query.filter_by(username=username).first()

    if db_user is not None:
      return make_response(jsonify({ "success": False, "msg": f"User with username `{username}` already exists." }), 400)

    new_user = User(
      username = data.get('username'),
      email = data.get('email'),
      password = generate_password_hash(data.get('password'))
    )
    new_user.save()

    return make_response(jsonify({ "msg": "User create successfully" }), 201)


    
@auth_ns.route('/login')
class Login(Resource):
  @auth_ns.expect(login_model)
  def post(self):
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    db_user = User.query.filter_by(username=username).first()

    if db_user and check_password_hash(db_user.password, password):
      access_token = create_access_token(identity=db_user.username)
      refresh_token = create_refresh_token(identity=db_user.username)

      response =  make_response(
        jsonify({
          "access_token": access_token,
          "refresh_token": refresh_token
        }), 200
      )

      # response.set_cookie("refresh_token", refresh_token)

      return response
    
    return make_response(
      jsonify({
        "msg": "Incorrect account information"
      }), 400
    )


@auth_ns.route('/refresh')
class RefreshResource(Resource):
  @jwt_required(refresh=True)
  def post(self):
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)

    response = make_response(
      jsonify({
        "access_token": new_access_token,
        "current_user": current_user
      }),
      200
    )
    
    return response



# @auth_ns.route('/all')
# class AllResource(Resource):
#   @auth_ns.marshal_list_with(drop_model)
#   def get(self):
#     """Get all users"""
#     users = User.query.all()
#     return users

  
# Use only to trim unused account
# @auth_ns.route('/drop/<int:id>')
# class DropResource(Resource):
#   @auth_ns.marshal_with(drop_model)
#   @jwt_required()
#   def delete(self, id):
#     """Delete unused account"""
#     account_to_delete = User.query.get_or_404(id)
#     print(account_to_delete)
#     account_to_delete.delete()
#     return account_to_delete
