import unittest
from main import create_app
from config import TestConfig
from exts import db

class APITestCase(unittest.TestCase):
  def setUp(self):
    self.app = create_app(TestConfig)
    self.client = self.app.test_client(self)

    with self.app.app_context():
      db.init_app(self.app)
      db.create_all()



  def test_hello_world(self):
    hello_response = self.client.get('/recipe/hello')
    json = hello_response.json

    self.assertEqual(json, { "msg": "Hello World" })



  def test_signup(self):
    signup_response = self.client.post('/auth/signup',
      json = { 
        "username": "testuser", 
        "email": "testuser@exmaple.com", 
        "password": "testpassword" 
      }
    )
    status_code = signup_response.status_code

    self.assertEqual(status_code, 201)



  def test_login(self):
    signup_response = self.client.post('/auth/signup',
      json = { 
        "username": "testuser", 
        "email": "testuser@exmaple.com", 
        "password": "testpassword" 
      }
    )
    login_response = self.client.post('/auth/login',
      json = {
        "username": "testuser",  
        "password": "testpassword" 
      }
    )
    status_code = login_response.status_code
    # json = login_response.json
    # print(json)
    self.assertEqual(status_code, 200)

  

  def test_get_all_recipes(self):
    """TEST GETTING ALL RECIPES"""
    response = self.client.get('/recipe/recipes')
    
    status_code = response.status_code

    self.assertEqual(status_code, 200)



  def test_get_one_recipe(self):
    """TEST GETTING ONE RECIPE"""
    id = 1
    response = self.client.get(f'/recipe/recipe/{id}')

    status_code = response.status_code

    self.assertEqual(status_code, 404)



  def test_create_recipe(self):
    """TEST CREATE ONE RECIPE"""
    signup_response = self.client.post('/auth/signup',
      json = { 
        "username": "testuser", 
        "email": "testuser@exmaple.com", 
        "password": "testpassword" 
      }
    )
    login_response = self.client.post('/auth/login',
      json = {
        "username": "testuser",  
        "password": "testpassword" 
      }
    )

    access_token = login_response.json["access_token"]

    create_recipe_response = self.client.post('/recipe/recipes',
      json = {
        "title": "Test Cookie",
        "description": "Test description",
      },
      headers = {
        "Authorization": f"Bearer {access_token}"
      }
    )
    
    status_code = create_recipe_response.status_code

    self.assertEqual(status_code, 201)



  def test_update_recipe(self):
    """TEST UPDATE ONE RECIPE"""
    # signup new user
    self.client.post('/auth/signup',
      json = { 
        "username": "testuser", 
        "email": "testuser@exmaple.com", 
        "password": "testpassword" 
      }
    )
    login_response = self.client.post('/auth/login',
      json = {
        "username": "testuser",  
        "password": "testpassword" 
      }
    )

    access_token = login_response.json["access_token"]

    # create recipe
    self.client.post('/recipe/recipes',
      json = {
        "title": "Test Cookie",
        "description": "Test description",
      },
      headers = {
        "Authorization": f"Bearer {access_token}"
      }
    )
    
    id = 1
    update_recipe_response = self.client.put(f'/recipe/recipe/{id}', 
      json = {
        "title": "Test Cookie Updated",
        "description": "Test description Updated",
      },
      headers = {
        "Authorization": f"Bearer {access_token}"
      }
    )
    
    status_code = update_recipe_response.status_code
    
    self.assertEqual(status_code, 200)



  def test_delete_recipe(self):
    """TEST DELETE ONE RECIPE"""
    # signup new user
    self.client.post('/auth/signup',
      json = { 
        "username": "testuser", 
        "email": "testuser@exmaple.com", 
        "password": "testpassword" 
      }
    )
    login_response = self.client.post('/auth/login',
      json = {
        "username": "testuser",  
        "password": "testpassword" 
      }
    )

    access_token = login_response.json["access_token"]

    # create recipe
    self.client.post('/recipe/recipes',
      json = {
        "title": "Test Cookie",
        "description": "Test description",
      },
      headers = {
        "Authorization": f"Bearer {access_token}"
      }
    )
    
    id = 1
    delete_recipe_response = self.client.delete(f'/recipe/recipe/{id}',
      headers = {
        "Authorization": f"Bearer {access_token}"
      }
    )

    status_code = delete_recipe_response.status_code
    # IF header is missing, status_code is 401
    self.assertEqual(status_code, 200)



  def tearDown(self):
    with self.app.app_context():
      db.session.remove()
      db.drop_all()




if __name__ == "__main__":
  unittest.main()
