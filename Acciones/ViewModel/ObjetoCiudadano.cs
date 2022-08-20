using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class ObjetoCiudadano
    {
        public int CiudadanoID { get; set; }
        public string RFC { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Nombre { get; set; }
        public string NombreCompleto { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public int recordarCumple { get; set; }
        public string Genero { get; set; }
        public string Colonia { get; set; }
        public string Calle { get; set; }
        public string Municipio { get; set; }
        public int ColoniaID { get; set; }
        public int CalleID { get; set; }
        public int CP { get; set; }
        public string NumeroExterior { get; set; }
        public string NumeroInterior { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Notas { get; set; }
        public string URL { get; set; }
        public string Partido { get; set; }
        public string LogoPartido { get; set; }
        public string TipoMiembro { get; set; }
        public string Seccion { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public string CURP { get; set; }
        public int Afin { get; set; }
        public int Rcasilla { get; set; }
        public int Noafin { get; set; }
        public int DDigital { get; set; }
    }
}
