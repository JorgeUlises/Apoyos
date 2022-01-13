using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
#nullable disable

namespace Acciones.Models
{
    public partial class Evento
    {
        public Evento()
        {
            ArchivosEventos = new HashSet<ArchivosEvento>();
            AsistentesEventos = new HashSet<AsistentesEvento>();
        }

        public int EventoId { get; set; }
        public int? LegislaturaId { get; set; }
        public int? DiputadoId { get; set; }
        [DataType(DataType.Date)]
        public DateTime? Fecha { get; set; }
        public string Descripcion { get; set; }
        public int? ColoniaId { get; set; }
        public int? CalleId { get; set; }
        public string NumExterior { get; set; }
        public string NumInterior { get; set; }
        public int? Cp { get; set; }
        public string Tipo { get; set; }
        public string Folio { get; set; }
        public string Distrito { get; set; }
        public string Seccion { get; set; }
        public int? NumAsistentes { get; set; }
        public int? Estatus { get; set; }
        public string Campo1 { get; set; }
        public int? Campo2 { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Calle Calle { get; set; }
        public virtual Colonia Colonia { get; set; }
        public virtual Diputado Diputado { get; set; }
        public virtual Legislatura Legislatura { get; set; }
        public virtual ICollection<ArchivosEvento> ArchivosEventos { get; set; }
        public virtual ICollection<AsistentesEvento> AsistentesEventos { get; set; }
    }
}
