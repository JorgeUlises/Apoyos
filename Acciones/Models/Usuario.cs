using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Usuario
    {
        public Usuario()
        {
            Bitacoras = new HashSet<Bitacora>();
            BitacorasGestion = new HashSet<BitacoraGestion>();
        }

        public int UsuarioId { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Nombre { get; set; }
        public string Puesto { get; set; }
        public string Telefono { get; set; }
        public int DiputadoId { get; set; }
        public string Clave { get; set; }
        public string Contrasena { get; set; }
        public int? RolId { get; set; }
        public string Email { get; set; }
        public int? Estatus { get; set; }
        public int? UsuarioRegistroId { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }

        public virtual Diputado Diputado { get; set; }
        public virtual Role Rol { get; set; }
        public virtual ICollection<Bitacora> Bitacoras { get; set; }
        public virtual ICollection<BitacoraGestion> BitacorasGestion { get; set; }
    }
}
