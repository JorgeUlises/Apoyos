using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class ArchivosEvento
    {
        public int ArchivosEventosId { get; set; }
        public int EventoId { get; set; }
        public string NombreArchivo { get; set; }
        public string NombreArchivoBd { get; set; }
        public string Nota { get; set; }
        public string Url { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Evento Evento { get; set; }
    }
}
