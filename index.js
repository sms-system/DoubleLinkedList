function assertIsArray (v) {
    if (!Array.isArray(v)) {
        throw new Error('Input is not array')
    }
}

class DoubleLinkedList {
    constructor (elements = []) {
        assertIsArray(elements)

        this._hash = {}
        this._index = 0
        this._startIndex = undefined
        this._endIndex = undefined

        this.length = 0

        this.push(...elements)
    }

    push (...elements) {
        const indexes = elements.map(val => {
            this._hash[this._index] = {
                val,
                next: undefined,
                prev: this._endIndex
            }
            if (!this.length) { this._startIndex = this._index }
            else { this._hash[this._endIndex].next = this._index }
            this._endIndex = this._index
            this.length++
            return this._index++
        })

        return indexes
    }

    pop () {
        if (!this.length) { return undefined }

        const element = this._hash[this._endIndex]
        if (this._endIndex + 1 === this._index) { this._index-- }
        delete this._hash[this._endIndex]
        this._endIndex = element.prev
        this.length--

        return element.val
    }

    unshift (...elements) {
        const indexes = new Array(elements.length)

        for (let i = elements.length; i > 0;) {
            this._hash[this._index] = {
                val: elements[--i],
                next: this._startIndex,
                prev: undefined
            }
            if (!this.length) { this._endIndex = this._index }
            else { this._hash[this._startIndex].prev = this._index }
            this._startIndex = this._index
            this.length++
            indexes[i] = this._index++
        }

        return indexes
    }

    shift () {
        if (!this.length) { return undefined }

        const element = this._hash[this._startIndex]
        if (this._startIndex + 1 === this._index) { this._index-- }
        this._startIndex = element.next
        delete this._hash[this._startIndex]
        this.length--

        return element.val
    }

    locate (index, offset = 0) {
        let element = this._hash[index]
        if (!element) { return [] }

        const stepOffset = offset < 0 ? -1 : 1
        const neighborDir = offset < 0 ? 'prev' : 'next'

        for (let i = 0; i !== offset; i += stepOffset) {
            index = element[neighborDir]
            if (index === undefined) { return [] }
            element = this._hash[index]
        }

        return [index, element.val]
    }

    indexOfFirst () { return this._startIndex }

    indexOfLast () { return this._endIndex }

    sliceWithCount (index, count = Infinity, withIndexes = false) {
        let element = this._hash[index]
        if (!element) { return [] }

        const values = []
        values.push(withIndexes ? [index, element.val] : element.val)

        const stepOffset = count < 0 ? -1 : 1
        const neighborDir = count < 0 ? 'prev' : 'next'

        for (let i = 0; i !== count; i += stepOffset) {
            index = element[neighborDir]
            if (index === undefined) { return values }
            element = this._hash[index]
            values.push(withIndexes ? [index, element.val] : element.val)
        }

        return values
    }

    splice (index, deleteCount = Infinity, ...elements) {
        let element = this._hash[index]
        if (!element) { return [] }
        let prevIndex = element.prev

        for (let i = 0; i < deleteCount;) {
            delete this._hash[index]
            this.length--
            i++
            index = element.next
            element = this._hash[index]

            if (!element) {
                this._index -= i
                break
            }
        }


        if (prevIndex === undefined) {
            this._startIndex = index
        } else {
            this._hash[prevIndex].next = index
        }

        const indexes = elements.map(val => {
            this._hash[this._index] = {
                val,
                next: index,
                prev: prevIndex
            }
            if (!this.length) { this._startIndex = this._index }
            else { this._hash[prevIndex].next = this._index }
            prevIndex = this._index
            this.length++
            return this._index++
        })

        if (element) {
            element.prev = elements.length ? this._index - 1 : prevIndex
        } else {
            this._endIndex = elements.length ? this._index - 1 : prevIndex
        }

        return indexes
    }

    * [Symbol.iterator] () {
        let next = this._startIndex
        while (next !== undefined) {
            const element = this._hash[next]
            yield element.val
            next = element.next
        }
    }
}

module.exports = DoubleLinkedList
