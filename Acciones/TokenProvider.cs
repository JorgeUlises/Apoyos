using System;
using System.Collections.Generic;
using System.Linq;
using Acciones.Models;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;


namespace Acciones
{
    public class TokenProvider
    {
        List<ObjUsuario> ListaUsuarios = new List<ObjUsuario>();
        private readonly dbAccionesContext _context;

        public TokenProvider(dbAccionesContext context)
        {
            _context = context;
        }

        public string LoginUser(string UserID, string Password)
        {
            string passEncriptado = ComputeSha256Hash(Password);
            Usuario usrLog = _context.Usuarios.Where(u => u.Clave == UserID && u.Contrasena == passEncriptado).FirstOrDefault();

            if (usrLog == null)
            {
                return null;
            }

            ObjUsuario usuarioFirmado = new ObjUsuario()
            {
                Id = usrLog.UsuarioId,
                Nombre = usrLog.Nombre + " " + usrLog.Paterno + " " + usrLog.Materno,
                Clave = usrLog.Clave,
                Contraseña = usrLog.Contrasena,
                Rol = (int)usrLog.RolId,
                Diputado = (int)usrLog.DiputadoId
            };

            //ObjUsuario U1 = new ObjUsuario
            //{
            //    Id = 1,
            //    Nombre = "Usuario Administrador",
            //    Clave = "usr",
            //    Contraseña = "123",
            //    Rol = 1
            //};

            //ListaUsuarios.Add(U1);

            //ObjUsuario U2 = new ObjUsuario
            //{
            //    Id = 2,
            //    Nombre = "Usuario 2",
            //    Clave = "usr",
            //    Contraseña = "456",
            //    Rol = 1
            //};

            //ListaUsuarios.Add(U2);

            //ObjUsuario usuarioFirmado = (from persona in ListaUsuarios where persona.Clave == UserID && persona.Contraseña == Password select persona).FirstOrDefault();

            //if (usuarioFirmado == null)
            //{
            //    return null;
            //}

            var key = System.Text.Encoding.ASCII.GetBytes("LegislaturaEstadoQueretaro2019");

            //Genera Token 
            var JWToken = new JwtSecurityToken(
                    issuer: "http://localhost:45092/",
                    audience: "http://localhost:45092/",
                    claims: GetUserClaims(usuarioFirmado),
                    notBefore: new DateTimeOffset(DateTime.Now).DateTime,
                    expires: new DateTimeOffset(DateTime.Now.AddDays(1)).DateTime,
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                );
            var token = new JwtSecurityTokenHandler().WriteToken(JWToken);

            return token;
        }

        private IEnumerable<Claim> GetUserClaims(ObjUsuario user)
        {
            //var _context = new dbRHComplementoContext();
            List<Claim> claims = new List<Claim>();
            Claim _claim;

            _claim = new Claim(ClaimTypes.Name, user.Nombre);
            claims.Add(_claim);
            _claim = new Claim(ClaimTypes.NameIdentifier, user.Id.ToString());
            claims.Add(_claim);
            _claim = new Claim("CLAVE", user.Clave);
            claims.Add(_claim);
            _claim = new Claim("CONTRASENA", user.Contraseña);
            claims.Add(_claim);
            _claim = new Claim("ROL", user.Rol.ToString());
            claims.Add(_claim);
            _claim = new Claim("DIPUTADO", user.Diputado.ToString());
            claims.Add(_claim);
            return claims.AsEnumerable<Claim>();
        }



        public static string ComputeSha256Hash(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }


    }

    /***********************
     * Objetos
     ***********************/
    public class ObjUsuario
    {
        public string Nombre { get; set; }
        public int Id { get; set; }
        public string Clave { get; set; }
        public string Contraseña { get; set; }
        public int Rol { get; set; }
        public int Diputado { get; set; }

    }
}
