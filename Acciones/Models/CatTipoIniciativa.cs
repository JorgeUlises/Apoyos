using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class CatTipoIniciativa
    {
        public CatTipoIniciativa()
        {
            //Iniciativas = new HashSet<Iniciativa>();
        }

        public int CatTipoIniciativaId { get; set; }
        public string Nombre { get; set; }
        public int Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        //public virtual ICollection<Iniciativa> Iniciativas { get; set; }
    }
}
