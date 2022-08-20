using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class BitacoraGestion
    {
        public BitacoraGestion()
        {
            ArchivosBitacorasGestion = new HashSet<ArchivosBitacoraGestion>();
        }

        public int BitacoraGestionId { get; set; }
        public int? GestionId { get; set; }
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
        public virtual Gestiones Gestion { get; set; }
        public virtual Usuario ResponsableNavigation { get; set; }
        public virtual ICollection<ArchivosBitacoraGestion> ArchivosBitacorasGestion { get; set; }
    }
}
