import os

def flag_is_set(environment_var_name):
    value = os.environ.get("SINGLE_SERVER_SETUP", 'false')
    return value.lower() in ["true", "1"]
