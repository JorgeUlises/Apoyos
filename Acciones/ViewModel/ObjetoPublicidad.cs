using Acciones.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class ObjetoPublicidad
    {
        public Publicidad PublicidadBase { get; set; }
        public string NombreCiudadano { get; set; }
        public string NombreColonia { get; set; }
        public string NombreCalle { get; set; }
        public string TipoPublicidad { get; set; }
        public string OrigenPublicidad { get; set; }
        public IEnumerable<ArchivosPublicidad> ArchivosRelacionadosPublicidad { get; set; }
    }
}
