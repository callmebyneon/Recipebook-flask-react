from datetime import timedelta
from decouple import config
import os

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

class Config:
  SECRET_KEY = config('SECRET_KEY')
  SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)
  # jwt
  JWT_SECRET_KEY = config('SECRET_KEY')
  JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
  JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)


class DevConfig(Config):
  SQLALCHEMY_DATABASE_URI = "sqlite:///dev.db"
  DEBUG = True
  SQLALCHEMY_ECHO = True


class ProdConfig(Config):
  SQLALCHEMY_DATABASE_URI = "sqlite:///dev.db"
  DEBUG = config('DEBUG', cast=bool)
  SQLALCHEMY_ECHO = config('ECHO', cast=bool)
  SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)


class TestConfig(Config):
  SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
  SQLALCHEMY_ECHO = False
  TESTING = True
