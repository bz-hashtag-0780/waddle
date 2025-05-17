import "RandomConsumer"

access(all) contract RandomPicker {
    /// The RandomConsumer.Consumer resource used to request & fulfill randomness
    access(self) let consumer: @RandomConsumer.Consumer
    /// The canonical path for common Receipt storage
    /// Note: production systems would consider handling path collisions
    access(all) let ReceiptStoragePath: StoragePath

    access(all) event Committed(values: [UInt64], commitBlock: UInt64, receiptID: UInt64)
    access(all) event Revealed(winningResult: UInt64, values: [UInt64], commitBlock: UInt64, receiptID: UInt64)

    /// The Receipt resource is used to store the values and the associated randomness request. By listing the
    /// RandomConsumer.RequestWrapper conformance, this resource inherits all the default implementations of the
    /// interface. This is why the Receipt resource has access to the getRequestBlock() and popRequest() functions
    /// without explicitly defining them.
    ///
    access(all) resource Receipt : RandomConsumer.RequestWrapper {
        access(all) let values: [UInt64]
        /// The associated randomness request which contains the block height at which the request was made
        /// and whether the request has been fulfilled.
        access(all) var request: @RandomConsumer.Request?

        init(values: [UInt64], request: @RandomConsumer.Request) {
            self.values = values
            self.request <- request
        }
    }

    access(all) fun commit(values: [UInt64]): @Receipt {
        pre {
            values.length > 0: "Array of values cannot be empty"
        }

        let request: @RandomConsumer.Request <- self.consumer.requestRandomness()
        let receipt: @RandomPicker.Receipt <- create Receipt(values: values, request: <- request)
        
        emit Committed(
            values: values, 
            commitBlock: receipt.getRequestBlock()!, 
            receiptID: receipt.uuid
        )

        return <-receipt
    }

    access(all) fun reveal(receipt: @Receipt): UInt64 {
        pre {
            receipt.getRequestBlock()! <= getCurrentBlock().height:
                "Must wait at least 1 block to reveal"
            receipt.request != nil:
                "Already revealed"
        }

        let values: [UInt64] = receipt.values
        let commitBlock: UInt64 = receipt.getRequestBlock()!
        let receiptID = receipt.uuid
        let request: @RandomConsumer.Request <- receipt.popRequest()

        let index: UInt64 = self.consumer.fulfillRandomInRange(request: <-request, min: 0, max: UInt64(values.length - 1))
        let winningResult: UInt64 = values[index]

        emit Revealed(
            winningResult: winningResult, 
            values: values, 
            commitBlock: commitBlock, 
            receiptID: receiptID
        )

        destroy receipt
        return winningResult
    }

    init() {
        self.consumer <- RandomConsumer.createConsumer()

        self.ReceiptStoragePath = /storage/FlowRandomPicker_GOWTF
    }

}