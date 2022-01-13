using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Colonia
    {
        public Colonia()
        {
            Asociaciones = new HashSet<Asociacione>();
            Calles = new HashSet<Calle>();
            Ciudadanos = new HashSet<Ciudadano>();
            Dependencia = new HashSet<Dependencia>();
            Eventos = new HashSet<Evento>();
            LugaresVisitados = new HashSet<LugaresVisitado>();
        }

        public int ColoniaId { get; set; }
        public string NombreColonia { get; set; }
        public string Distrito { get; set; }
        public string Seccion { get; set; }
        public int? EstatusColonia { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistroId { get; set; }

        public virtual ICollection<Asociacione> Asociaciones { get; set; }
        public virtual ICollection<Calle> Calles { get; set; }
        public virtual ICollection<Ciudadano> Ciudadanos { get; set; }
        public virtual ICollection<Dependencia> Dependencia { get; set; }
        public virtual ICollection<Evento> Eventos { get; set; }
        public virtual ICollection<LugaresVisitado> LugaresVisitados { get; set; }
    }
}
