import LinkedList from "../LinkedList/LinkedList";
import LinkedListNode from "../LinkedList/LinkedListNode";



class PriorityQueue<T> {
    public front: LinkedListNode<T> | null;
    public rear: LinkedListNode<T> | null;
    buffer: LinkedList<T>;
    compareFunction: (a: T, b: T) => number;

    constructor(compareFunction: (a: T, b: T) => number) {      
        this.buffer = new LinkedList();        
        this.front = this.buffer.head;
        this.rear = this.buffer.tail;
        this.compareFunction = compareFunction;
    }

    // Adding by relying on traditional insertion sort algorithm
    add(item: T) {
        // If the buffer is empty, simply add the item.
        if (this.buffer.isEmpty()) {
            this.buffer.add(item);
        } else {
            // Find the correct position for the new item.
            let current = this.buffer.head;
            let index = 0;
            while (current != null && this.compareFunction(item, current.data) > 0) {
                current = current.next;
                index++;
            }
            // Insert the item at the found position.
            if (index === 0) {
                this.buffer.addFirst(item);
            } else if (current === null) {
                this.buffer.addLast(item);
            } else {
                this.buffer.insertBefore(index, item);
            }
        }
        // Update front and rear pointers.
        this.front = this.buffer.head;
        this.rear = this.buffer.tail;
    }

    removeFirst() {
        const removedFront = this.buffer.getFirst();
        this.buffer.removeFirst();
        this.front = this.buffer.head;
        return removedFront;
    }

    removeLast() {
        this.buffer.removeLast();
        this.rear = this.buffer.tail;
    }

    getFirst() {
        return this.buffer.getFirst();
    }

    getLast() {
        return this.buffer.getLast();
    }

    getBuffer() {
        return this.buffer;
    }
    
    size() {
        return this.buffer.size();
    }

    isEmpty() {
        return this.buffer.isEmpty();
    }

    clear() {
        this.buffer.clear();
        this.front = this.buffer.head;
        this.rear = this.buffer.tail;
    }
    

}

export default PriorityQueue;