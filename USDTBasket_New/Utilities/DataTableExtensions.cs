using System.Collections.Generic;
using System.Data;
using System.Reflection;
using System;

namespace Api.Utilities
{
    public static class DataTableExtensions
    {
        public static string blockchainApi = "https://hiicall.com/Blockchain/Crypto/"; // Replace with your actual API URL
        public static string appKey = "00e6c02100e3fed9dbf3d1b29f5be9cc0f5defd15be88fe0a250a9c8a86e65f2"; // Replace with the actual app key
        public static DataTable ToDataTable<T>(this List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            // Get all the properties
            PropertyInfo[] props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in props)
            {
                dataTable.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            }

            foreach (T item in items)
            {
                var values = new object[props.Length];
                for (int i = 0; i < props.Length; i++)
                {
                    values[i] = props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }

            return dataTable;
        }
        public static bool HasDataTable(DataSet ds)
        {
            return ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0;
        }


        // Optional: IsDataTable method
        public static bool IsDataTable(DataTable table)
        {
            return table != null && table.Rows.Count > 0;
        }


    }
}
