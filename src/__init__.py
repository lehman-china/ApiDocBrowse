# -*- coding: utf-8 -*-
__version__ = '0.1'
import os
from bottle import Bottle, TEMPLATE_PATH
app = Bottle()

curPath = os.path.dirname(__file__)

TEMPLATE_PATH.append( curPath+"/../views/template/")
TEMPLATE_PATH.remove("./views/")
from src.api_doc.controller import *