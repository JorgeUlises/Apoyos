using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Role
    {
        public Role()
        {
            Usuarios = new HashSet<Usuario>();
        }

        public int RolId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int Estatus { get; set; }

        public virtual ICollection<Usuario> Usuarios { get; set; }
    }
}
