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

/**
 * Type for registering element tpyes to an application.
 * Application will match elements with matching selectors to the specified type.
 */
export class InteractiveElementType {
  constructor (selector, type) {
    this.selectorString = selector
    this._type = type
  }

  /**
   * Selector to match elements to.
   *
   * @returns {string} Selector to match elements to.
   */
  get selector () {
    return this.selectorString
  }

  /**
   * Element type to register matching elements as.
   *
   * @returns {object} Element type to register matching elements as.
   */
  get type () {
    return this._type
  }

  /**
   * Selector's specificity value.
   * Elements will match to the most specific selector first.
   *
   * @returns {string} Selector's specificity value.
   */
  get specificity () {
    const interactiveElementType = this

    /**
     * Checks if the selector matches a given regex.
     *
     * @param {string} regex - Regex.
     * @returns {number} Number of matches.
     */
    function numMatches (regex) {
      return (interactiveElementType.selector.match(regex) || []).length
    }

    const numClasses = numMatches(/\.[\w-_]+\b/g)
    const numIds = numMatches(/#[\w-_]+\b/g)
    let numNamesInBraces = 0
    const namesInBraces = interactiveElementType.selector.match(
      /\[[^\]]*\b[\w-_]+\b[^\]]*\]/g) ||
        []
    for (let idx = 0; idx < namesInBraces.length; ++idx) {
      numNamesInBraces += (namesInBraces[idx].match(/\b[\w-_]+\b/g) ||
          []).length
    }

    const results = [0, 0, 0, 0]
    results[1] = numIds
    results[2] = numMatches(/\[[^\]]+\]/g) + numClasses
    results[3] = numMatches(/\b[\w-_]+\b/g) - numIds - numClasses -
        numNamesInBraces
    return results.join(',')
  }
}
