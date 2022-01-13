using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Calle
    {
        public Calle()
        {
            Asociaciones = new HashSet<Asociacione>();
            Ciudadanos = new HashSet<Ciudadano>();
            Dependencia = new HashSet<Dependencia>();
            Eventos = new HashSet<Evento>();
            LugaresVisitados = new HashSet<LugaresVisitado>();
        }

        public int CalleId { get; set; }
        public string NombreCalle { get; set; }
        public string Manzana { get; set; }
        public string Distrito { get; set; }
        public string Seccion { get; set; }
        public string Lote { get; set; }
        public int? Estatus { get; set; }
        public int? ColoniaId { get; set; }

        public virtual Colonia Colonia { get; set; }
        public virtual ICollection<Asociacione> Asociaciones { get; set; }
        public virtual ICollection<Ciudadano> Ciudadanos { get; set; }
        public virtual ICollection<Dependencia> Dependencia { get; set; }
        public virtual ICollection<Evento> Eventos { get; set; }
        public virtual ICollection<LugaresVisitado> LugaresVisitados { get; set; }
    }
}
