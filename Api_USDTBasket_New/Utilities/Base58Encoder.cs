
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace FXCapitalApi.Repositories
{
    public static class Base58Encoder
    {
        public static readonly char[] Alphabet;

        private static readonly int[] Indexes;

        static Base58Encoder()
        {
            Alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz".ToCharArray();
            Indexes = new int[128];
            for (int i = 0; i < Indexes.Length; i++)
            {
                Indexes[i] = -1;
            }

            for (int j = 0; j < Alphabet.Length; j++)
            {
                Indexes[Alphabet[j]] = j;
            }
        }

        private static byte Divmod58(byte[] number, int startAt)
        {
            int num = 0;
            for (int i = startAt; i < number.Length; i++)
            {
                int num2 = number[i] & 0xFF;
                int num3 = num * 256 + num2;
                number[i] = (byte)(num3 / 58);
                num = num3 % 58;
            }

            return (byte)num;
        }

        private static byte Divmod256(byte[] number58, int startAt)
        {
            int num = 0;
            for (int i = startAt; i < number58.Length; i++)
            {
                int num2 = number58[i] & 0xFF;
                int num3 = num * 58 + num2;
                number58[i] = (byte)(num3 / 256);
                num = num3 % 256;
            }

            return (byte)num;
        }

        private static byte[] CopyOfRange(byte[] source, int from, int to)
        {
            byte[] array = new byte[to - from];
            Array.Copy(source, from, array, 0, array.Length);
            return array;
        }

        public static byte[] DecodeFromBase58Check(string addressBase58)
        {
            if (string.IsNullOrWhiteSpace(addressBase58))
            {
                return null;
            }

            byte[] array = Decode(addressBase58);
            if (array.Length <= 4)
            {
                return null;
            }

            byte[] array2 = new byte[array.Length - 4];
            Array.Copy(array, 0, array2, 0, array2.Length);
            byte[] array3 = Hash(Hash(array2));
            bool flag = true;
            for (int i = 0; i < 4; i++)
            {
                if (array3[i] != array[array2.Length + i])
                {
                    flag = false;
                    break;
                }
            }

            if (!flag)
            {
                return null;
            }

            return array2;
        }

        public static byte[] TwiceHash(byte[] input)
        {
            return Hash(Hash(input));
        }

        public static byte[] Hash(byte[] input)
        {
            SHA256Managed sHA256Managed = new SHA256Managed();
            using (MemoryStream inputStream = new MemoryStream(input))
            {
                try
                {
                    return sHA256Managed.ComputeHash(inputStream);
                }
                finally
                {
                    sHA256Managed.Clear();
                }
            }
        }

        public static string EncodeFromHex(string hexAddress, byte prefix)
        {
            byte[] array = hexAddress.HexToByteArray();
            byte[] array2 = new byte[21];
            Array.Copy(array, array.Length - 20, array2, 1, 20);
            array2[0] = prefix;
            byte[] sourceArray = TwiceHash(array2);
            byte[] array3 = new byte[4];
            Array.Copy(sourceArray, array3, 4);
            byte[] array4 = new byte[25];
            Array.Copy(array2, 0, array4, 0, 21);
            Array.Copy(array3, 0, array4, 21, 4);
            return Encode(array4);
        }

        public static string EncodeFromHex(byte[] hexBytes, byte prefix)
        {
            byte[] array = new byte[21];
            Array.Copy(hexBytes, hexBytes.Length - 20, array, 1, 20);
            array[0] = prefix;
            byte[] sourceArray = TwiceHash(array);
            byte[] array2 = new byte[4];
            Array.Copy(sourceArray, array2, 4);
            byte[] array3 = new byte[25];
            Array.Copy(array, 0, array3, 0, 21);
            Array.Copy(array2, 0, array3, 21, 4);
            return Encode(array3);
        }

        public static string Encode(byte[] input)
        {
            if (input.Length == 0)
            {
                return "";
            }

            input = CopyOfRange(input, 0, input.Length);
            int i;
            for (i = 0; i < input.Length && input[i] == 0; i++)
            {
            }

            byte[] array = new byte[input.Length * 2];
            int j = array.Length;
            int num = i;
            while (num < input.Length)
            {
                byte b = Divmod58(input, num);
                if (input[num] == 0)
                {
                    num++;
                }

                array[--j] = (byte)Alphabet[b];
            }

            for (; j < array.Length && array[j] == Alphabet[0]; j++)
            {
            }

            while (--i >= 0)
            {
                array[--j] = (byte)Alphabet[0];
            }

            byte[] bytes = CopyOfRange(array, j, array.Length);
            return Encoding.ASCII.GetString(bytes);
        }

        public static byte[] Decode(string input)
        {
            if (input.Length == 0)
            {
                return new byte[0];
            }

            byte[] array = new byte[input.Length];
            for (int i = 0; i < input.Length; i++)
            {
                char c = input[i];
                int num = -1;
                if (c >= '\0' && c < '\u0080')
                {
                    num = Indexes[c];
                }

                if (num < 0)
                {
                    throw new ArgumentOutOfRangeException("Illegal character " + c + " at " + i);
                }

                array[i] = (byte)num;
            }

            int j;
            for (j = 0; j < array.Length && array[j] == 0; j++)
            {
            }

            byte[] array2 = new byte[input.Length];
            int k = array2.Length;
            int num2 = j;
            while (num2 < array.Length)
            {
                byte b = Divmod256(array, num2);
                if (array[num2] == 0)
                {
                    num2++;
                }

                array2[--k] = b;
            }

            for (; k < array2.Length && array2[k] == 0; k++)
            {
            }

            return CopyOfRange(array2, k - j, array2.Length);
        }
    }
}