# Copyright 2020 OpenRCA Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from flask import Blueprint
from flask_restx import Api

from orca_mock.api.resources.v1.graph import namespace as graph_ns
from orca_mock.api.resources.v1.alert import namespace as alert_ns

blueprint = Blueprint('api', __name__, url_prefix='/v1')

api = Api(
    blueprint,
    title='OpenRCA API',
    version='0.1',
)

api.add_namespace(graph_ns)
api.add_namespace(alert_ns)
