using System.Numerics;
using TronNet.ABI.FunctionEncoding.Attributes;
using TronNet.Contracts;

namespace FXCapitalApi.Models
{
    public class TransferTokenFunction : FunctionMessage
    {
        [Parameter("address", "token", 1)]
        public string _TokenAddress
        {
            get;
            set;
        }

        [Parameter("address", "from", 2)]
        public string _FromAddress
        {
            get;
            set;
        }

        [Parameter("address", "to", 3)]
        public string _ToAddress
        {
            get;
            set;
        }

        [Parameter("uint", "amount", 4)]
        public BigInteger _TokenAmount
        {
            get;
            set;
        }
    }
}
