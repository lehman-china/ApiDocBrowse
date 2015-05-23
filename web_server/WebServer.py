

import os

from lib.bottle import debug, run

from src import app


debug(True)
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 3000))
    run(app, reloader=True, host='192.168.1.100', port=port)
