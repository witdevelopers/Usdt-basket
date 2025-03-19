using System;
using System.Collections.Generic;
using System.Linq;

namespace FXCapitalApi.Repositories
{
    public static class ByteArrary
    {
        private static readonly byte[] Empty = Array.Empty<byte>();

        public static string ToHex(this byte[] value, bool prefix = false)
        {
            return string.Concat(prefix ? "0x" : "", string.Concat(value.Select((byte b) => b.ToString("x2")).ToArray()));
        }

        public static bool HasHexPrefix(this string value)
        {
            return value.StartsWith("0x");
        }

        public static bool IsHex(this string value)
        {
            string text = value.RemoveHexPrefix();
            foreach (char c in text)
            {
                if ((c < '0' || c > '9') && (c < 'a' || c > 'f') && (c < 'A' || c > 'F'))
                {
                    return false;
                }
            }

            return true;
        }

        public static string RemoveHexPrefix(this string value)
        {
            return value.Substring(value.StartsWith("0x") ? 2 : 0);
        }

        public static bool IsTheSameHex(this string first, string second)
        {
            return string.Equals(first.EnsureHexPrefix().ToLower(), second.EnsureHexPrefix().ToLower(), StringComparison.Ordinal);
        }

        public static string EnsureHexPrefix(this string value)
        {
            if (value == null)
            {
                return null;
            }

            if (!value.HasHexPrefix())
            {
                return "0x" + value;
            }

            return value;
        }

        public static string[] EnsureHexPrefix(this string[] values)
        {
            if (values != null)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i].EnsureHexPrefix();
                }
            }

            return values;
        }

        public static string ToHexCompact(this byte[] value)
        {
            return value.ToHex().TrimStart('0');
        }

        private static byte[] HexToByteArrayInternal(string value)
        {
            byte[] array = null;
            if (string.IsNullOrEmpty(value))
            {
                array = Empty;
            }
            else
            {
                int length = value.Length;
                int num = value.StartsWith("0x", StringComparison.Ordinal) ? 2 : 0;
                int num2 = length - num;
                bool flag = false;
                if (num2 % 2 != 0)
                {
                    flag = true;
                    num2++;
                }

                array = new byte[num2 / 2];
                int num3 = 0;
                if (flag)
                {
                    array[num3++] = FromCharacterToByte(value[num], num);
                    num++;
                }

                for (int i = num; i < value.Length; i += 2)
                {
                    byte b = FromCharacterToByte(value[i], i, 4);
                    byte b2 = FromCharacterToByte(value[i + 1], i + 1);
                    array[num3++] = (byte)(b | b2);
                }
            }

            return array;
        }

        public static byte[] HexToByteArray(this string value)
        {
            try
            {
                return HexToByteArrayInternal(value);
            }
            catch (FormatException innerException)
            {
                throw new FormatException($"String '{value}' could not be converted to byte array (not hex?).", innerException);
            }
        }

        private static byte FromCharacterToByte(char character, int index, int shift = 0)
        {
            byte b = (byte)character;
            if ((64 < b && 71 > b) || (96 < b && 103 > b))
            {
                if (64 == (0x40 & b))
                {
                    b = ((32 != (0x20 & b)) ? ((byte)(b + 10 - 65 << shift)) : ((byte)(b + 10 - 97 << shift)));
                }
            }
            else
            {
                if (41 >= b || 64 <= b)
                {
                    throw new FormatException($"Character '{character}' at index '{index}' is not valid alphanumeric character.");
                }

                b = (byte)(b - 48 << shift);
            }

            return b;
        }

        public static byte[] Merge(params byte[][] arrays)
        {
            return MergeToEnum(arrays).ToArray();
        }

        private static IEnumerable<byte> MergeToEnum(params byte[][] arrays)
        {
            foreach (byte[] array in arrays)
            {
                byte[] array2 = array;
                for (int j = 0; j < array2.Length; j++)
                {
                    yield return array2[j];
                }
            }
        }
    }
}
