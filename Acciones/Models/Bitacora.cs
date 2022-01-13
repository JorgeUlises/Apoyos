using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Bitacora
    {
        public Bitacora()
        {
            ArchivosBitacoras = new HashSet<ArchivosBitacora>();
        }

        public int BitacoraId { get; set; }
        public int? PeticionId { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaCompromiso { get; set; }
        public DateTime? FechaConclusion { get; set; }
        public string Descripcion { get; set; }
        public int? Estatus { get; set; }
        public double? Costo { get; set; }
        public string Nota { get; set; }
        public int? DependeciaId { get; set; }
        public string Responsable { get; set; }
        public int? ResponsableId { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Dependencia Dependecia { get; set; }
        public virtual Peticione Peticion { get; set; }
        public virtual Usuario ResponsableNavigation { get; set; }
        public virtual ICollection<ArchivosBitacora> ArchivosBitacoras { get; set; }
    }
}
