using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class ArchivosGestiones
    {
        public int ArchivosGestionesId { get; set; }
        public int GestionId { get; set; }
        public string NombreArchivo { get; set; }
        public string NombreArchivoBd { get; set; }
        public string Nota { get; set; }
        public string Url { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Gestiones Gestion { get; set; }
    }
}
