using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using TronNet;
using TronNet.ABI;
using TronNet.ABI.Encoders;
using TronNet.ABI.FunctionEncoding;
using TronNet.ABI.FunctionEncoding.AttributeEncoding;
using TronNet.ABI.FunctionEncoding.Attributes;
using TronNet.ABI.Model;

namespace FXCapitalApi.Utilities
{
    public class ParametersEncoder
    {
        private readonly IntTypeEncoder intTypeEncoder;

        private readonly AttributesToABIExtractor attributesToABIExtractor;

        public ParametersEncoder()
        {
            intTypeEncoder = new IntTypeEncoder();
            attributesToABIExtractor = new AttributesToABIExtractor();
        }

        public byte[] EncodeAbiTypes(ABIType[] abiTypes, params object[] values)
        {
            if (values == null && abiTypes.Length != 0)
            {
                throw new ArgumentNullException("values", "No values specified for encoding");
            }

            if (values == null)
            {
                return new byte[0];
            }

            if (values.Length > abiTypes.Length)
            {
                throw new Exception("Too many arguments: " + values.Length + " > " + abiTypes.Length);
            }

            int num = 0;
            int num2 = 0;
            for (int i = 0; i < values.Length; i++)
            {
                int fixedSize = abiTypes[i].FixedSize;
                if (fixedSize < 0)
                {
                    num2++;
                    num += 32;
                }
                else
                {
                    num += fixedSize;
                }
            }

            byte[][] array = new byte[values.Length + num2][];
            int num3 = num;
            int num4 = 0;
            for (int j = 0; j < values.Length; j++)
            {
                ABIType aBIType = abiTypes[j];
                if (aBIType.IsDynamic())
                {
                    byte[] array2 = aBIType.Encode(values[j]);
                    array[j] = intTypeEncoder.EncodeInt(num3);
                    array[values.Length + num4] = array2;
                    num4++;
                    num3 += array2.Length;
                }
                else
                {
                    try
                    {
                        array[j] = aBIType.Encode(values[j]);
                    }
                    catch (Exception innerException)
                    {
                        throw new AbiEncodingException(j, aBIType, values[j], string.Format("An error occurred encoding abi value. Order: '{0}', Type: '{1}', Value: '{2}'.  Ensure the value is valid for the abi type.", j + 1, aBIType.Name, values[j] ?? "null"), innerException);
                    }
                }
            }

            return ByteUtil.Merge(array);
        }

        public byte[] EncodeParameters(Parameter[] parameters, params object[] values)
        {
            return EncodeAbiTypes(parameters.Select((Parameter x) => x.ABIType).ToArray(), values);
        }

        public byte[] EncodeParametersFromTypeAttributes(Type type, object instanceValue)
        {
            List<ParameterAttributeValue> parameterAttributeValues = GetParameterAttributeValues(type, instanceValue);
            Parameter[] parametersInOrder = GetParametersInOrder(parameterAttributeValues);
            object[] valuesInOrder = GetValuesInOrder(parameterAttributeValues);
            return EncodeParameters(parametersInOrder, valuesInOrder);
        }

        public object[] GetValuesInOrder(List<ParameterAttributeValue> parameterObjects)
        {
            return (from x in parameterObjects
                    orderby x.ParameterAttribute.Order
                    select x.Value).ToArray();
        }

        public Parameter[] GetParametersInOrder(List<ParameterAttributeValue> parameterObjects)
        {
            return (from x in parameterObjects
                    orderby x.ParameterAttribute.Order
                    select x.ParameterAttribute.Parameter).ToArray();
        }

        public List<ParameterAttributeValue> GetParameterAttributeValues(Type type, object instanceValue)
        {
            IEnumerable<PropertyInfo> propertiesWithParameterAttribute = PropertiesExtractor.GetPropertiesWithParameterAttribute(type);
            List<ParameterAttributeValue> list = new List<ParameterAttributeValue>();
            foreach (PropertyInfo item in propertiesWithParameterAttribute)
            {
                ParameterAttribute customAttribute = item.GetCustomAttribute<ParameterAttribute>(inherit: true);
                object obj = item.GetValue(instanceValue);
                attributesToABIExtractor.InitTupleComponentsFromTypeAttributes(item.PropertyType, customAttribute.Parameter.ABIType);
                if (customAttribute.Parameter.ABIType is TupleType)
                {
                    obj = GetTupleComponentValuesFromTypeAttributes(item.PropertyType, obj);
                }

                list.Add(new ParameterAttributeValue
                {
                    ParameterAttribute = customAttribute,
                    Value = obj
                });
            }

            return list;
        }

        public object[] GetTupleComponentValuesFromTypeAttributes(Type type, object instanceValue)
        {
            IOrderedEnumerable<PropertyInfo> orderedEnumerable = from x in PropertiesExtractor.GetPropertiesWithParameterAttribute(type)
                                                                 where x.IsDefined(typeof(ParameterAttribute), inherit: true)
                                                                 orderby x.GetCustomAttribute<ParameterAttribute>(inherit: true)!.Order
                                                                 select x;
            List<object> list = new List<object>();
            foreach (PropertyInfo item in orderedEnumerable)
            {
                ParameterAttribute? customAttribute = item.GetCustomAttribute<ParameterAttribute>(inherit: true);
                object obj = item.GetValue(instanceValue);
                if (customAttribute!.Parameter.ABIType is TupleType)
                {
                    obj = GetTupleComponentValuesFromTypeAttributes(item.PropertyType, obj);
                }

                list.Add(obj);
            }

            return list.ToArray();
        }

        public string EncodeRequest<T>(T functionInput, string sha3Signature)
        {
            byte[] value = EncodeParametersFromTypeAttributes(typeof(T), functionInput);
            return EncodeRequest(sha3Signature, value.ToHex());
        }

        public string EncodeRequest(string sha3Signature, string encodedParameters)
        {
            string text = "0x";
            if (sha3Signature.StartsWith(text))
            {
                text = "";
            }

            return text + sha3Signature + encodedParameters;
        }

    }
}
