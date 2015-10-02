# -*- coding: utf-8 -*-
__version__ = '0.1'
import os

import src.commons.constants.COMMON
from lib.bottle import Bottle, TEMPLATE_PATH

app = Bottle()

curPath = os.path.dirname(__file__)

TEMPLATE_PATH.append( curPath+"/../views/")
TEMPLATE_PATH.remove("./views/")
from src.api_doc.controller import *