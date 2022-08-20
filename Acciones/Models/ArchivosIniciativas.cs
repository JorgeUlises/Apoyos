using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class ArchivosIniciativas
    {
        public int ArchivosIniciativaId { get; set; }
        public int IniciativaId { get; set; }
        public string NombreArchivo { get; set; }
        public string NombreArchivoBd { get; set; }
        public string Nota { get; set; }
        public string Url { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }
    }
}
