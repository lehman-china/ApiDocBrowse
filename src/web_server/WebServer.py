from bottle import *
TEMPLATE_PATH = []



# @route('/<filename:path>')
# def send_static(filename):
#     return static_file(filename, root='../../views')


@route('/hello/:name')
def hello(name):

    return template('/views/hello_template.tpl', username=name)


run(host='localhost', port=5000, debug=True)