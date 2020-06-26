/*
  ~      Copyright (C) 2020  Kestros, Inc.
  ~
  ~     This program is free software: you can redistribute it and/or modify
  ~     it under the terms of the GNU General Public License as published by
  ~     the Free Software Foundation, either version 3 of the License, or
  ~     (at your option) any later version.
  ~
  ~     This program is distributed in the hope that it will be useful,
  ~     but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~     GNU General Public License for more details.
  ~
  ~     You should have received a copy of the GNU General Public License
  ~     along with this program.  If not, see <https://www.gnu.org/licenses/>.
  ~
  */

let assert = require('assert');

import {InteractiveElement}
  from '../../js/interactive-element'
import {InteractiveElementType}
  from '../../js/interactive-element-type'

describe('InteractiveElementType', function () {

  it('initialize', function () {
    let interactiveElementType = new InteractiveElementType('.test',
        InteractiveElement)
    assert.notEqual(interactiveElementType, null)
  })

  it('get selector', function () {
    let interactiveElementType = new InteractiveElementType('.test',
        InteractiveElement)
    assert.equal(interactiveElementType.selector, '.test')
  })

  it('get type', function () {
    let interactiveElementType = new InteractiveElementType('.test',
        InteractiveElement)
    assert.equal(interactiveElementType.type, InteractiveElement)
  })

  it('get specificity', function () {
    let interactiveElementType = new InteractiveElementType('.test',
        InteractiveElement)
    assert.equal(interactiveElementType.specificity, '0,0,1,0')
  })

  it('get specificity when more specific', function () {
    let interactiveElementType = new InteractiveElementType(
        'div ul.test.test1.test2', InteractiveElement)
    assert.equal(interactiveElementType.specificity, '0,0,3,2')
  })

})

