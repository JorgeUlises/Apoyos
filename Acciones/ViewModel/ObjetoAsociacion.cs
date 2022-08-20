using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class ObjetoAsociacion
    {
        public int AsociacionID { get; set; }
        public string Nombre { get; set; }
        public string Presidente { get; set; }
        public string Colonia { get; set; }
        public string Calle { get; set; }
        public int ColoniaID { get; set; }
        public int CalleID { get; set; }
        public int CP { get; set; }
        public string NumeroExterior { get; set; }
        public string NumeroInterior { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Notas { get; set; }
    }
}

