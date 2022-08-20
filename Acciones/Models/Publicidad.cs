using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Acciones.Models
{
    public class Publicidad
    {
        public int PublicidadId { get; set; }
        public int? CiudadanoId { get; set; }
        public string Folio { get; set; }
        public string Nombre { get; set; }
        public string Tamaño { get; set; }
        public string Notas { get; set; }
        public int? TipoPublicidadId { get; set; }
        public int? OrigenId { get; set; }
        public int? Barda_Lona { get; set; }
        public int? ColoniaId { get; set; }
        public int? CalleId { get; set; }
        public string NumExterior { get; set; }
        public string NumInterior { get; set; }
        public int? Cp { get; set; }
        public string Distrito { get; set; }
        public string Seccion { get; set; }
        public int? Estatus { get; set; }
        public string Campo1 { get; set; }
        public int? Campo2 { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistroId { get; set; }
        public int? DiputadoId { get; set; }
        [DataType(DataType.Date)]
        public DateTime? FechaInstalacion { get; set; }
        [DataType(DataType.Date)]
        public DateTime? FechaRetiro { get; set; }
        public string Responsable { get; set; }

    }
}
