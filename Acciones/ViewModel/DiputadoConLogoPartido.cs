using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class DiputadoConLogoPartido
    {
        public int DiputadoId { get; set; }
        public string Nombre { get; set; }
        public int partidoId { get; set; }
        public string Logo { get; set; }
        public string NombrePartido { get; set; }
        public int Diputadoseleccionado { get; set; }
    }
}
