using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public partial class EstatusGestion
    {
        public EstatusGestion()
        {
            Gestion = new HashSet<Gestiones>();
        }

        public int EstatusGestionId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual ICollection<Gestiones> Gestion { get; set; }
    }
}